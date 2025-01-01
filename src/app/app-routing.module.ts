import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TvprogramComponent } from './pages/My/tvprogram/tvprogram.component';
import { DxDataGridModule, DxFormModule, DxHtmlEditorModule, DxSwitchModule, DxTextBoxModule } from 'devextreme-angular';
import { DxButtonModule, DxProgressBarModule } from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { OpenAiFormComponent } from './shared/openAI/OpenAiForm/OpenAiForm.component';
import { WebSpeechComponent } from './pages/My/web-speech/web-speech.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'speechTest',
    component: WebSpeechComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'programs',
    component: TvprogramComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'openAiTest',
    component: OpenAiFormComponent,
    canActivate: [AuthGuardService],
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    DxDataGridModule, DxSelectBoxModule, DxFormModule, DxButtonModule, DxProgressBarModule, DxSwitchModule, DxTextBoxModule, DxHtmlEditorModule
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TvprogramComponent,
    OpenAiFormComponent,
    WebSpeechComponent
  ]
})
export class AppRoutingModule { }
