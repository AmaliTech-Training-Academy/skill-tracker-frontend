import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TextArea } from './components/text-area/text-area';


@Component({
  selector: 'app-written-response',
  imports: [FormsModule, TextArea],
  templateUrl: './written-response.html',
  styleUrl: './written-response.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrittenResponse  {
 
 
}