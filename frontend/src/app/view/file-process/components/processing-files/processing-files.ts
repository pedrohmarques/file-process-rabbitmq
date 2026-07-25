import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'processing-files',
  imports: [
    MatIconModule
  ],
  templateUrl: './processing-files.html',
  styleUrl: './processing-files.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingFiles {
  files = input<any[]>([])
}
