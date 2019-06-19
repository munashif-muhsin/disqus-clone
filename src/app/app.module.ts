import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  AppComponent
} from './app.component';
import {
  HomeComponent
} from './pages/home/home.component';
import {
  AdminComponent
} from './pages/admin/admin.component';
import {
  HeaderComponent
} from './modules/header/header.component';
import {
  FooterComponent
} from './modules/footer/footer.component';
import {
  PostComponent
} from './pages/post/post.component';

import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  AngularFireStorageModule
} from '@angular/fire/storage';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';

import { FormsModule } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

const appRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    data: {
      title: 'Admin - Voter Circle'
    }
  },
  {
    path: 'post/:id',
    component: PostComponent,
    data: {
      title: 'Post - Voter Circle'
    }
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule ,
    FormsModule,
    RouterModule.forRoot(
      appRoutes, {
        enableTracing: false
      } // <-- debugging purposes only
    ),
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule {}
