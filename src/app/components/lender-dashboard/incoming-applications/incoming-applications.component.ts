import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoanApplicationService } from '../../../services/loan-application.service';

@Component({
  selector: 'app-incoming-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incoming-applications.component.html',
  styleUrls: ['./incoming-applications.component.css']
})
export class IncomingApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading: boolean = false;
  error: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private loanApplicationService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    this.loanApplicationService.getLenderApplications().subscribe({
      next: (applications: any[]) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to load applications';
        this.loading = false;
      }
    });
  }

  updateApplicationStatus(applicationId: number, status: string) {
    this.loading = true;
    this.loanApplicationService.updateLoanStatus(applicationId, status).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.loadApplications(); 
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to update application status';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      case 'under_review':
        return 'status-under-review';
      default:
        return 'status-pending';
    }
  }

  goBack() {
    this.router.navigate(['/lender']);
  }

  sortApplications(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.applications.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === 'loanAmount' || field === 'creditScore') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (field === 'applicationDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  exportToCSV() {
    if (this.applications.length === 0) {
      alert('No applications to export');
      return;
    }

    const headers = ['Application ID', 'Borrower Name', 'Loan Amount', 'Purpose', 'Status', 'Credit Score', 'Age', 'Employment Status', 'Application Date'];
    const csvContent = [
      headers.join(','),
      ...this.applications.map(app => [
        app.loanApplicationId || '',
        app.borrowerName || '',
        app.loanAmount || '',
        app.loanPurpose || '',
        app.status || '',
        app.creditScore || '',
        app.age || '',
        app.employmentStatus || '',
        app.applicationDate || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `incoming-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    if (this.applications.length === 0) {
      alert('No applications to export');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Unable to open print window. Please check your browser settings.');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Incoming Applications Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .status-approved { color: green; font-weight: bold; }
          .status-rejected { color: red; font-weight: bold; }
          .status-pending { color: orange; font-weight: bold; }
          .status-under-review { color: blue; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Incoming Loan Applications Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Borrower Name</th>
              <th>Loan Amount</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Credit Score</th>
              <th>Age</th>
              <th>Employment Status</th>
              <th>Application Date</th>
            </tr>
          </thead>
          <tbody>
            ${this.applications.map(app => `
              <tr>
                <td>${app.loanApplicationId || 'N/A'}</td>
                <td>${app.borrowerName || 'N/A'}</td>
                <td>₹${app.loanAmount || '0'}</td>
                <td>${app.loanPurpose || 'N/A'}</td>
                <td class="${this.getStatusClass(app.status)}">${app.status || 'N/A'}</td>
                <td>${app.creditScore || 'N/A'}</td>
                <td>${app.age || 'N/A'}</td>
                <td>${app.employmentStatus || 'N/A'}</td>
                <td>${app.applicationDate || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
}
