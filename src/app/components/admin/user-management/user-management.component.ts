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
  filteredUsersList: any[] = []; // Store filtered users to avoid recursion
  selectedUser: any = null;
  searchQuery: string = '';
  currentPage: number = 1;
  usersPerPage: number = 4;
  totalPages: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.applyFilters(); // Initialize filteredUsersList
    });
  }

  applyFilters() {
    this.filteredUsersList = this.users;
    if (this.searchQuery) {
      this.filteredUsersList = this.users.filter(user =>
        (user?.username || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (user?.role || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    console.log('Filtered users:', this.filteredUsersList); // Debug log
    this.updatePagination();
  }

  filteredUsers() {
    return this.filteredUsersList; // Return cached filtered users
  }

  viewUser(user: any) {
    this.selectedUser = user;
  }

  updatePagination(): void {
    const filteredCount = this.filteredUsersList.length; // Use cached list
    this.totalPages = Math.ceil(filteredCount / this.usersPerPage) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    console.log('Total pages:', this.totalPages, 'Current page:', this.currentPage);
  }

  get paginatedUsers(): any[] {
    const filtered = this.filteredUsersList;
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const slicedUsers = filtered.slice(startIndex, startIndex + this.usersPerPage);
    console.log('Paginated users:', slicedUsers);
    return slicedUsers;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 4;
    const halfWindow = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, this.currentPage - halfWindow);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    console.log('Visible pages:', visiblePages);
    return visiblePages;
  }
}