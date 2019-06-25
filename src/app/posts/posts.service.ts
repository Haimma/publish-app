import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})// create one service of the service
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/Posts/get')
    .pipe(map((postsData) => {
      return postsData.map(post => {
        return {
          appId: post.appId,
          title: post.title,
          description: post.description,
          imgDir: post.imgDir,
          androidUrl: post.androidUrl,
          iosUrl: post.iosUrl,
        };
      });
    }))
    .subscribe((result) => {
      this.posts = result;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(appId: string) {
    return this.http.get<{_appId: number, title: string, description: string, imgDir: string, androidUrl: string, iosUrl: string}>(
      'http://localhost:3000/api/Posts/get/' + appId
      );
  }

  addPost(title: string, description: string, image: File, androidUrl: string, iosUrl: string) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('imgDir', image, title);
    postData.append('androidUrl', androidUrl);
    postData.append('iosUrl', iosUrl);
    this.http.post<{post: Post}>('http://localhost:3000/api/Posts/add', postData)
    .subscribe((res) => {
      const newPost: Post = {appId: res.post.appId, title, description, imgDir: res.post.imgDir, androidUrl, iosUrl};
      this.posts.push(newPost);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  editPost(appId: string, title: string, description: string, imgDir: File | string, androidUrl: string, iosUrl: string) {
    let postData: Post | FormData;
    const id = Number(appId);
    if (typeof(imgDir) ===  'object') {
      postData = new FormData();
      postData.append('appId', appId);
      postData.append('title', title);
      postData.append('description', description);
      postData.append('imgDir', imgDir, title);
      postData.append('androidUrl', androidUrl);
      postData.append('iosUrl', iosUrl);
    }
    else {
      postData = { appId: id, title, description, imgDir, androidUrl, iosUrl};
    }
    this.http.put<{appId: number}>('http://localhost:3000/api/Posts/edit/' + appId, postData)
    .subscribe((res) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.appId === id);
      const post: Post = { appId: id, title, description, imgDir: '', androidUrl, iosUrl};

      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
    this.router.navigate(['/']);
  }

  deletePost(appId: number) {
    this.http.delete('http://localhost:3000/api/Posts/delete/' + appId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.appId !== appId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
