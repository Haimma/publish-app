import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.less']
})

export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private appId: string;
  form: FormGroup;
  post: Post;
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      imgDir: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      androidUrl: new FormControl(null),
      iosUrl: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('appId')) {
        this.mode = 'edit';
        this.appId = paramMap.get('appId');
        this.postsService.getPost(this.appId).subscribe(postData => {
          this.post = {
            appId: Number(this.appId),
            title: postData[0].title,
            description: postData[0].description,
            imgDir: postData[0].imgDir,
            androidUrl: postData[0].androidUrl,
            iosUrl: postData[0].iosUrl
          };
          this.form.setValue({
            title: this.post.title,
            description: this.post.description,
            imgDir: this.post.imgDir,
            androidUrl: this.post.androidUrl,
            iosUrl: this.post.iosUrl
          });
        });
      } else {
        this.mode = 'create';
        this.appId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({imgDir: file});
    this.form.get('imgDir').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.description,
        this.form.value.imgDir,
        this.form.value.androidUrl,
        this.form.value.iosUrl
        );
    } else {
      this.postsService.editPost(
        this.appId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.imgDir,
        this.form.value.androidUrl,
        this.form.value.iosUrl
        );
    }
    this.form.reset();
  }
}

