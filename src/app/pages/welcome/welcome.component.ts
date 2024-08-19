import { Component, OnInit, inject } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [NgZorroModule,CommonModule,FormsModule,ReactiveFormsModule],
})
export class WelcomeComponent implements OnInit {

  passwordVisible = false;
  password?: string;
  private router = inject(Router);
  // private router: Router

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });


  constructor(private fb: NonNullableFormBuilder){}

  ngOnInit() {}

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;

      // การเช็ค username และ password
      if (userName === 'admin' && password === '1111') {
        console.log('Login successful');
        // นำทางไปยังหน้าอื่น ๆ หลังจากการเข้าสู่ระบบสำเร็จ
        this.router.navigate(['home']);
      } else {
        console.error('Invalid username or password');
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } else {
      // ถ้าฟอร์มไม่ valid จะแสดงข้อความแจ้งเตือน
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
