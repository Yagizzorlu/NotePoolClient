import { Component, Input } from '@angular/core';
import { UserProfileDto } from '../../../../../contracts/user-profile-dto';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.scss']
})
export class ProfileStatsComponent {
  @Input() user!: UserProfileDto;
}

