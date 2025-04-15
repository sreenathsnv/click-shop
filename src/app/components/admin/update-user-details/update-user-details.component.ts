import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../auth/models/user.model';
import { log } from 'console';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.css'],
  standalone:false,
})
export class UpdateUserDetailsComponent implements OnInit {

  userForm: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User | null = null;
  searchQuery: string = '';
  filteredUsers: User[] = [];
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: ['', Validators.required],
      houseName: [''],
      street: [''],
      district: [''],
      state: [''],
      zipcode: ['']
    });

    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }
  

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();
  
    this.users$.subscribe(users => {
      this.filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery)
      );
    });
  }
  onUserSelect(event: any) {
    const selectedUser = event.target.value ? JSON.parse(event.target.value) : null;
    
    if (selectedUser) {
      this.userForm.patchValue({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
        houseName: selectedUser.houseName,
        street: selectedUser.street,
        state:selectedUser.state,
        district: selectedUser.district,
        zipcode:selectedUser.zipcode
      });

      console.log(selectedUser);
      
    }
   
    
  }
  onSubmit(): void {
    if (this.userForm.valid && this.selectedUser) {
      const updatedUser: User = { ...this.selectedUser, ...this.userForm.getRawValue() };
      this.userService.updateUserByAdmin(updatedUser).subscribe(
        () => alert('User details updated successfully'),
        () => alert('Failed to update user details')
      );
    }
  }



}
