import { Component, OnInit, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }


  snackBarDialog(data?: any, action?: string) {
    /**
     * Method to display snack bar notification
     * @param data Message to be displayed on the snack bar.
     */
    const snackBarRef = this.snackBar.open(
        data, null, {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'snackbar'
      }
    );
  }

}
