import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FileDragdrop } from './components/file-dragdrop/file-dragdrop';
import { ProcessingFiles } from './components/processing-files/processing-files';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'file-process',
  imports: [
    FileDragdrop,
    ProcessingFiles,
    MatIconModule
  ],
  templateUrl: './file-process.html',
  styleUrl: './file-process.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileProcess {
  files = signal<File[]>([])

  sendFilesToQueue(event: File[]) {
    console.log(event)
    this.files.set(event)
  }
}
