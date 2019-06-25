import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';



const routes: Routes = [
  { path: '', component: PostCreateComponent},
  { path: 'edit/:appId', component: PostCreateComponent},
  // { path: 'adminPage', component: PostCreateComponent},
  { path: 'userPage', component: PostListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
