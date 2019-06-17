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

const firebaseConfig = {
  apiKey: 'AIzaSyAfyRTxI0tm93cl5OvZF_bko_iDY4bgoDI',
  authDomain: 'disqus-76bcf.firebaseapp.com',
  databaseURL: 'https://disqus-76bcf.firebaseio.com',
  projectId: 'disqus-76bcf',
  storageBucket: '',
  messagingSenderId: '697347440910',
  appId: '1:697347440910:web:32367d28a115a45d'
};

const appRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    data: {
      title: 'Admin - Voter Circle'
    }
  },
  {
    path: 'post',
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
    RouterModule.forRoot(
      appRoutes, {
        enableTracing: false
      } // <-- debugging purposes only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
