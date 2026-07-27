import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FileDragdrop } from './components/file-dragdrop/file-dragdrop';
import { ProcessingFiles } from './components/processing-files/processing-files';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, finalize, Subscription, takeUntil } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { AppConfigService } from '../../services/app-config.service';

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
export class FileProcess implements OnDestroy, OnInit {
  files = signal<any[]>([])
  private socketSubscription!: Subscription;


  constructor(
    private readonly httpClient: HttpClient,
    private readonly socket: SocketService,
    private readonly appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.socketSubscription = this.socket.listen<any>('file-progress').subscribe((jobProcess: any) => {
      this.files.update(files =>
        files.map(file =>
          file.jobId === jobProcess.jobId
            ? {
                ...file,
                progress: jobProcess.progress,
                status: jobProcess.status
              }
            : file
        )
      );
      console.log(this.files())
    })
  }

  ngOnDestroy(): void {
    if(this.socketSubscription) {
      this.socketSubscription.unsubscribe()
    }
  }

  sendFilesToQueue(event: File[]) {
    const formData = new FormData();
    event.forEach(file => {
      formData.append('files', file)
    })

    this.httpClient.post(`${this.appConfig.apiUrl}/files/upload`, formData).pipe(
      catchError(error => {
        console.error(error);
        return EMPTY;
      })
    ).subscribe((res: any) => {
      if(res.length > 0) {
        this.files.set(res)
        res.forEach((job: any) => {          
          this.socket.emit('join-job', job.jobId)
        })
      }
    })
  }
}
