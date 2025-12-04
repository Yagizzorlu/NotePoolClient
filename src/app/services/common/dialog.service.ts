import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal'; // DOĞRUSU BU

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(parameters: Partial<DialogParameters>): void {
    const dialogRef = this.dialog.open(parameters.componentType!, {
      width: parameters.options?.width || "400px", // Varsayılan değerler
      height: parameters.options?.height,
      position: parameters.options?.position,
      data: parameters.data,
      disableClose: parameters.options?.disableClose // Tıklayınca kapanmasın seçeneği
    });
    dialogRef.afterClosed().subscribe(result => {
      if (parameters.afterClosed) {
        parameters.afterClosed(result);
      }
    });
  }
}
export class DialogParameters {
  componentType: ComponentType<any>; 
  data?: any;                        
  afterClosed?: (result?: any) => void;          
  options?: Partial<DialogOptions> = new DialogOptions();
}
export class DialogOptions {
  width?: string = "250px";
  height?: string;
  position?: any; 
  disableClose?: boolean = false; 
}