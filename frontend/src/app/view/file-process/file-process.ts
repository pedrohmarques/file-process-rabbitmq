import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FileDragdrop } from './components/file-dragdrop/file-dragdrop';
import { ProcessingFiles } from './components/processing-files/processing-files';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, finalize, takeUntil } from 'rxjs';

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


  constructor(private readonly httpClient: HttpClient) {

  }

  sendFilesToQueue(event: File[]) {
    this.files.set(event)
    const formData = new FormData();
    this.files().forEach(file => {
      formData.append('files', file)
    })

    this.httpClient.post('http://localhost:3000/files/upload', formData).pipe(
      catchError(error => {
        console.error(error);
        return EMPTY;
      })
    ).subscribe((res) => {
      console.log(res)
    })
  }
}
