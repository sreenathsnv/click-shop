import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  searchQuery: string = '';
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  filteredUsers() {
    if (!this.searchQuery) return this.users;
    return this.users.filter(user =>
      user.username?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  
  viewUser(user: any) {
    this.selectedUser = user;
  }
}
