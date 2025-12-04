import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() count: number = 1;
  
  @Input() appearance: 'note-card' | 'text' | 'circle' | 'profile-header' = 'note-card';

  items: number[] = [];

  ngOnInit(): void {
    this.items = Array(this.count).fill(0);
  }
}

