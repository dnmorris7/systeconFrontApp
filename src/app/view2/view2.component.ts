import { Component, OnInit, ViewChild } from '@angular/core';
import { CSVRecord } from '../csvrecord/csvrecord.component';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-view2',
  templateUrl: './view2.component.html',
  styleUrls: ['./view2.component.css']
})

export class View2Component {
  title = 'Angular7AppReadCSVView2';

  public records: any[] = [];
  sortedData: any[];
  t1:any[];
  t2:any[];
  // constructor(){
  //   this.sortedData = this.records.slice();
  // }

  @ViewChild('csvReader', { static: false }) csvReader: any;

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.model = curruntRecord[0].trim();
        csvRecord.point = curruntRecord[1].trim();
        csvRecord.iid = curruntRecord[2].trim();
        csvRecord.stid = curruntRecord[3].trim();
        csvRecord.ststiz = curruntRecord[4].trim();
        csvRecord.rosiz = curruntRecord[5].trim();
        csvRecord.nbo = curruntRecord[6].trim();
        csvRecord.dpy = curruntRecord[7].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }



  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  sortData(sort: Sort) {
    console.log("Sorting Data...")
    const data = this.records.slice();
    let t1 = performance.now();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'model': return this.compare(a.model, b.model, isAsc);
        case 'point': return this.compare(a.point, b.point, isAsc);
        case 'iid': return this.compare(a.iid, b.iid, isAsc);
        case 'stid': return this.compare(a.stid, b.stid, isAsc);
        case 'ststiz': return this.compare(a.ststiz, b.ststiz, isAsc);
        case 'rosiz': return this.compare(a.rosiz, b.rosiz, isAsc);
        case 'nbo': return this.compare(a.nbo, b.nbo, isAsc);
        case 'dpy': return this.compare(a.dpy, b.dpy, isAsc);
        default: return 0;

      }

    }

    );

    let t2 = performance.now();
    console.log("Time to Sort Records = " + (t2 - t1))
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}   
