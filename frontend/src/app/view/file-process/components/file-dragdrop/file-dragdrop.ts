import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'file-dragdrop',
  imports: [
    MatIconModule
  ],
  templateUrl: './file-dragdrop.html',
  styleUrl: './file-dragdrop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDragdrop {
  private readonly allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  readonly filesSelected = output<File[]>();

  constructor(private toastr: ToastrService) {}

  private validateFiles(files: File[]): File[] {
    return files.filter(file =>
      this.allowedTypes.includes(file.type)
    );
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (!input.files) {
      return;
    }
  
    const files: File[] = Array.from(input.files);
    if(this.validateFiles(files)) {
      this.filesSelected.emit(files)
    } else {
      this.toastr.error(
        'Falha ao enviar arquivo!',
        'Error'
      );
    }   
  }
}
