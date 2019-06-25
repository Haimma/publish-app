import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSubscribe: Subscription;
  private deviceInfo = null;
  mode = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private deviceService: DeviceDetectorService) {
    this.detectDevice();
  }

  detectDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo().os;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (this.route.snapshot.routeConfig.path === 'userPage') {
        this.mode = true;
      } else {
        this.mode = false;
      }
      this.postsService.getPosts();
      this.postsSubscribe = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
          this.posts = posts;
        });
    });
  }

  ngOnDestroy() {
    this.postsSubscribe.unsubscribe();
  }

  onDelete(appId: number) {
    this.postsService.deletePost(appId);
  }

  onGoTo(post: Post) {
    if (this.deviceInfo === 'iOS' || this.deviceInfo === 'Mac') {
      window.open('https://' + post.iosUrl, '_self');
    }
    else if (this.deviceInfo === 'Android' || this.deviceInfo === 'Windows') {
      window.open('https://' + post.androidUrl, '_self');
    }
  }
}
