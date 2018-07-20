import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  panelOpenState = false;
  dropDownValues: any = {};
  contentForm: FormGroup;
  methodState: boolean;
  contentDetails: any = [];
  contentFormLoaded: boolean = true;
  contentFormId: any = {};
  userName: any;

  constructor(
    private dataService: DataService,
    private _form: FormBuilder,
    public snackBar: SnackBarComponent,
    public appComponent: AppComponent

    ) {
      this.contentForm = this._form.group({
        content: this._form.array([this.initContent()])
      });

      if (this.dataService.getCredentials() !== '') {
        this.userName = JSON.parse(this.dataService.getCredentials())['name'];
      }
    }


  initContent(data?) {
    if (data) {
      return this._form.group(data);
    } else {
      return this._form.group({
        'genre': ['', Validators.required],
        'story': ['', Validators.required],
        'category': ['', Validators.required],
        'geographical_rights': ['', Validators.required],
        'currency': ['', Validators.required],
        'price': ['', Validators.required]
      });
    }
  }


  ngOnInit() {
    this.fetchContent(response => {
      this.contentDetails = response;
      if (this.contentDetails.length > 0) {
        for (const detail of this.contentDetails) {
          this.addNewRow(detail);
        }
      }
    });
    this.fetchDropDownValues(response => {
      this.dropDownValues = response;
    });
  }


  fetchContent(callback: (response: any) => any) {
    /**
     * Makes API call to fetch existing contents of a user
     */
    this.dataService.contentService('GET')
    .subscribe(response => {
      callback(response);
    });
  }


  fetchDropDownValues(callback: (response: any) => any) {
    /**
     * Fetches drop down values to be rendered on the frontend.
     */
    this.dataService.contentService('OPTIONS')
    .subscribe(response => {
      callback(response);
    });
  }


  addNewRow(formData?: any) {
    /**
     * Method to add new form field
     */
    let newForm: any;
    let control: any;
    control = <FormArray>this.contentForm.controls['content'];
    if (formData) {
      if (this.contentFormLoaded) {
        control.removeAt(0);
        this.contentFormLoaded = false;
      }
      newForm = this.initContent(formData);
      control.push(newForm);
    } else {
      newForm = this.initContent();
      control.push(newForm);
    }

  }


  deleteRow(index: number) {
    /**
     * Method to delete current form field.
     */
    let control: any;
    control = <FormArray>this.contentForm.controls['content'];
    control.removeAt(index);
    if (this.contentDetails.length > 0 && this.contentDetails[index] !== undefined) {
      this.appComponent.showBar = true;
      const id = this.contentDetails[index]['id'];
      this.deleteService(id, response => {
        this.snackBar.snackBarDialog('Deleted Successfully');
        this.contentDetails.splice(index, 1);
        this.appComponent.showBar = false;
      });
    }
  }


  deleteService(id, callback: (response: any) => any) {
    /**
     * Makes API call to delete the particular content of the user.
     */
    this.dataService.contentService('DELETE', id)
    .subscribe(response => {
      callback(response);
    });
  }


  saveRow(index: number) {
    /**
     * Saves new content of the user.
     */
    const mapData: any = {};
    let control: any;
    control = this.contentForm.controls['content']['controls'][index]['controls'];
    Object.keys(control).forEach(keys => {
      mapData[keys] = control[keys].value;
    });
    this.appComponent.showBar = true;
    this.dataService.contentService('POST', mapData)
    .subscribe(response => {
      this.snackBar.snackBarDialog('Added Successfully');
      this.contentDetails.push(response);
      this.appComponent.showBar = false;
    });
  }


  editRow(index: number) {
    /**
     * Updates particular field of a content.
     */
    const mapData: any = {};
    let control: any;
    control = this.contentForm.controls['content']['controls'][index]['controls'];
    Object.keys(control).forEach(keys => {
      mapData[keys] = control[keys].value;
    });
    mapData['id'] = this.contentDetails[index]['id'];
    this.appComponent.showBar = true;
    this.dataService.contentService('PATCH', mapData)
    .subscribe(response => {
      this.snackBar.snackBarDialog('Edited Successfully');
      this.contentDetails[index] = response;
      this.appComponent.showBar = false;
    });
  }


  logout() {
    this.appComponent.showBar = true;
    this.dataService.logout()
    .subscribe(response => {
      this.userName = undefined;
      this.appComponent.showBar = false;
    });
  }

}
