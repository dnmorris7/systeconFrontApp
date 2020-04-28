import { Component, OnInit, ViewChild } from '@angular/core';
import { CSVRecord1 } from '../csvrecord/cvsrecord1.component';
import { CSVRecord } from '../csvrecord/csvrecord.component';
import { Chart } from 'chart.js';
import * as d3 from "d3";
@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css']
})
export class View1Component implements OnInit {
  records: any[];


  constructor() { }

  ngOnInit() {
  }

  //get the data from resources
  chartData($event: any): void {
    console.log("Fetch Data Function Step 1")

    let text = [];
    let files = $event.srcElement.files;


    if (this.isValidCSVFile(files[0])) {
      let testrecords: any[];
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        let testrecords = this.records;
        console.log(this.records[0])
        console.log(this.records[0].a)
        console.log(this.records[0].lsc)

        var aData = testrecords.map(function (record) { return record.a })
        var lscData = testrecords.map(function (record) { return record.lsc })

        console.log("A Data: " + aData);
        console.log("LSC Data: " + lscData);
        let index = 1;
        console.log(aData[14])
        //      console.log("Data Points: " + this.records.forEach(index =>(this.records[index].lsc, this.records[index].lsc)) )

        data: [

          this.records.map(function (record) { return record.a }), this.records.map(function (record) { return record.lsc })

        ];


        var ctx = 'myChart'

        console.log("Generating Chart...")
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            yAxes: 'Availiability',
            labels: ['0', '5,000,000', '10,000,000', '15,000,000', '20,000,000', '25,000,000'],
            datasets: [{


              data: aData, lscData

              //[
              //  this.records.forEach(function(record){record.a}), this.records.forEach(function(record){ record.lsc})

              //  (aData[i], lscData[i])
              //                    this.records.forEach(index =>(this.records[index].a, this.records[index].lsc))    
              // (this.records[1].a, this.records[1].lsc), (this.records[2].a, this.records[2].lsc),
              //          (this.records[2].a, this.records[2].lsc), (this.records[3].a, this.records[3].lsc)
              //]
              ,

              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',],
            }]
          },
          options: {
            scales: {

              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]

            }

          }

        });
      };



    }
  }

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
        let csvRecord: CSVRecord1 = new CSVRecord1();
        csvRecord.model = curruntRecord[0].trim();
        csvRecord.point = curruntRecord[1].trim();
        csvRecord.a = curruntRecord[2].trim();
        csvRecord.lsc = curruntRecord[3].trim();
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

}
