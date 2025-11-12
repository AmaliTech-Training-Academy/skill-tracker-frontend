import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-written-response',
  imports: [FormsModule],
  templateUrl: './written-response.html',
  styleUrl: './written-response.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrittenResponse  {
 
 
}