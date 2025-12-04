import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityType } from '../activity-list/activity-list.component';

@Component({
  selector: 'app-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss']
})
export class ProfileTabsComponent {

  @Input() activeTab: ActivityType = 'notes';
  @Input() isOwner: boolean = false; // Kendi profilim mi?

  // Seçilen tab'ı üst componente bildir
  @Output() tabChange = new EventEmitter<ActivityType>();

  // Tab Listesi (Dinamik yapı)
  get tabs() {
    const items = [
      { id: 'notes', label: 'Paylaşımlar', icon: 'fa-solid fa-layer-group' },
      { id: 'comments', label: 'Yorumlar', icon: 'fa-regular fa-comments' }
    ];

    // "İndirdiklerim" ve "Beğendiklerim" özel veridir, sadece sahibi görebilir.
    if (this.isOwner) {
      items.push({ id: 'downloads', label: 'İndirdiklerim', icon: 'fa-solid fa-clock-rotate-left' });
      // items.push({ id: 'likes', label: 'Beğendiklerim', icon: 'fa-solid fa-heart' }); // İleride eklenebilir
    }

    return items;
  }

  selectTab(tabId: string) {
    this.activeTab = tabId as ActivityType;
    this.tabChange.emit(this.activeTab);
  }
}
