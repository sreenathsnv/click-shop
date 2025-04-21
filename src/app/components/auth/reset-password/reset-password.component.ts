import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  loading = false;
  resetForm:any;
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 

  

  resetPassword() {
    if (this.resetForm.invalid) return;

    const { email, newPassword } = this.resetForm.value;
    this.loading = true;

    this.userService.resetPassword(email!, newPassword!).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Password reset successfully',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.resetForm.reset();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Password reset failed',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
    });
  }

}
