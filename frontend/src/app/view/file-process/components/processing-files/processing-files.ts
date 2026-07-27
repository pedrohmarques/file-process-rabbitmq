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

  formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }
}
