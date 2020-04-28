
import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { CSVRecord3 } from '../csvrecord/csvRecord3.component';

export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-view3',
  templateUrl: './view3.component.html',
  styleUrls: ['./view3.component.css']
})
export class View3Component {

  displayedColumns: string[] = ['iid', 'descr', 'price', 'frt', 'opid', 'type', 'giid', 'note'];
  dataSource: any[]; //NEED TO REPLACE WITH RECORDS ARRAY //new MatTableDataSource<PeriodicElement>();
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = ELEMENT_DATA.length - 2; // = 9
  FIRST_EDITABLE_COL: number = 1;                       // first column pos is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = this.displayedColumns.length - 1; // = 3
  newCellValue: string = '';

  /**
   * NOTE: nbRows    of selectedCellsState must = nbRows of the tabl
   * nbColumns of selectedCellsState must = nbColumns of all selectable cells in the table
   */
  selectedCellsState: boolean[][] = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false]
  ];
  records: any[];

  constructor(public snackBar: MatSnackBar) { }

  /**
   * Update table's dataSource
   * @param text
   */
  updateSelectedCellsValues(text: string) {

    if (text == null) { return; }

    if (this.tableMouseDown && this.tableMouseUp) {
      if (this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {

        const dataCopy: CSVRecord3[] = this.dataSource.slice(); // copy and mutate
        let startCol: number;
        let endCol: number;
        let startRow: number;
        let endRow: number;

        if (this.tableMouseDown.colId <= this.tableMouseUp.colId) {
          startCol = this.tableMouseDown.colId;
          endCol = this.tableMouseUp.colId;
        } else {
          endCol = this.tableMouseDown.colId;
          startCol = this.tableMouseUp.colId;
        }

        if (this.tableMouseDown.rowId <= this.tableMouseUp.rowId) {
          startRow = this.tableMouseDown.rowId;
          endRow = this.tableMouseUp.rowId;
        } else {
          endRow = this.tableMouseDown.rowId;
          startRow = this.tableMouseUp.rowId;
        }

        //--Edit cells from the same column
        if (startCol === endCol) {
          console.log('--Edit cells from the same column');
          for (let i = startRow; i <= endRow; i++) {
            dataCopy[i][this.displayedColumns[startCol]] = text;
          }
        } else {
          //--Edit cells starting and ending not on the same column
          console.log('--Edit cells starting and ending not on the same column');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.displayedColumns[j]] = text;
            }
          }
        }
        console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);
        this.dataSource = dataCopy;

      } else {
        this.openSnackBar('The selected cells don\'t have the same type.', 'OK');
      }
    }
  }

  /**
   * @param rowId
   * @param colId
   * @param cellsType
   */
  onMouseDown(rowId: number, colId: number, cellsType: string) {

    this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
  }

  /**
   * @param rowId
   * @param colId
   * @param cellsType
   */
  onMouseUp(rowId: number, colId: number, cellsType: string) {

    this.tableMouseUp = { rowId: rowId, colId: colId, cellsType: cellsType };
    if (this.tableMouseDown) {
      this.newCellValue = '';
      this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
    }
  }

  /**
   * Update selectedCols && selectedRows arrays
   * @param mouseDownColId
   * @param mouseUpColId
   * @param mouseDownRowId
   * @param mouseUpRowId
   */
  private updateSelectedCellsState(mouseDownColId: number, mouseUpColId: number, mouseDownRowId: number, mouseUpRowId: number) {

    // init selected cells
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
    // update selected cells
    let startCol: number;
    let endCol: number;
    let startRow: number;
    let endRow: number;
    if (mouseDownColId <= mouseUpColId) {
      startCol = mouseDownColId;
      endCol = mouseUpColId;
    } else {
      endCol = mouseDownColId;
      startCol = mouseUpColId;
    }

    if (mouseDownRowId <= mouseUpRowId) {
      startRow = mouseDownRowId;
      endRow = mouseUpRowId;
    } else {
      endRow = mouseDownRowId;
      startRow = mouseUpRowId;
    }
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        this.selectedCellsState[i][j] = true;
      }
    }
  }

  /**
   * After the user enters a new value, all selected cells must be updated
   * document:keyup
   * @param event
   */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {

    // If no cell is selected then ignore keyUp event
    if (this.tableMouseDown && this.tableMouseUp) {

      let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
        'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
        'TabTab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

      if (event.key === 'Backspace') { // 'delete' key is pressed
        const end: number = this.newCellValue.length - 1;
        this.newCellValue = this.newCellValue.slice(0, end);

      } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
        this.newCellValue += event.key;
      }
      this.updateSelectedCellsValues(this.newCellValue);
    }
  }

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }

  /**
   * @param message
   * @param action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 4000 });
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

        this.dataSource = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
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
        let csvRecord: CSVRecord3 = new CSVRecord3();
        csvRecord.iid = curruntRecord[0].trim();
        csvRecord.descr = curruntRecord[1].trim();
        csvRecord.price = curruntRecord[2].trim();
        csvRecord.frt = curruntRecord[3].trim();
        csvRecord.opid = curruntRecord[4].trim();
        csvRecord.type = curruntRecord[5].trim();
        csvRecord.giid = curruntRecord[6].trim();
        csvRecord.note = curruntRecord[7].trim();
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











// import { Component, HostListener } from '@angular/core';

// export interface PeriodicElement {
//   name:     string;
//   position: number;
//   weight:   number;
//   symbol:   string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1 , name: 'Hydrogen' , weight: 1.0079 , symbol: 'H' },
//   {position: 2 , name: 'Helium'   , weight: 4.0026 , symbol: 'He'},
//   {position: 3 , name: 'Lithium'  , weight: 6.941  , symbol: 'Li'},
//   {position: 4 , name: 'Beryllium', weight: 9.0122 , symbol: 'Be'},
//   {position: 5 , name: 'Boron'    , weight: 10.811 , symbol: 'B' },
//   {position: 6 , name: 'Carbon'   , weight: 12.0107, symbol: 'C' },
//   {position: 7 , name: 'Nitrogen' , weight: 14.0067, symbol: 'N' },
//   {position: 8 , name: 'Oxygen'   , weight: 15.9994, symbol: 'O' },
//   {position: 9 , name: 'Fluorine' , weight: 18.9984, symbol: 'F' },
//   {position: 10, name: 'Neon'     , weight: 20.1797, symbol: 'Ne'},
// ];

// @Component({
//   selector: 'app-view3',
//   templateUrl: './view3.component.html',
//   styleUrls: ['./view3.component.css']
// })
// export class View3Component {
//   displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
//   dataSource = ELEMENT_DATA;














//   // onMouseDown(rowId: number, colId: number, cellsType: string) {

//   //   this.tableMouseDown = {rowId: rowId, colId: colId, cellsType: cellsType};
//   // }

//   // onMouseUp(rowId: number, colId: number, cellsType: string) {

//   //   this.tableMouseUp = {rowId: rowId, colId: colId, cellsType: cellsType};
//   //   if(this.tableMouseDown) {
//   //     this.newCellValue = '';
//   //     this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
//   //   }
//   // }

//   // selectedCellsState: boolean[][] = [
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false],
//   //   [false, false, false]
//   // ];

// }




// import { Component, Input, ViewChild, Renderer2, forwardRef } from '@angular/core';
// import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


// const VALUE_ACCESSOR = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => View3Component),
//   multi: true
// };

// @Component({
//   providers: [VALUE_ACCESSOR],
  // selector: 'app-view3',
  // templateUrl: './view3.component.html',
  // styleUrls: ['./view3.component.css']
// })

// export class View3Component implements ControlValueAccessor{
//   @Input() label: string = "Enter value here"; 
//   @Input() required: boolean = true; 
//   private _value: string = ''; 
//   private preValue: string = '';
//   public editing: boolean = false; 
//   public onChange: any = Function.prototype; 
//   public onTouched: any = Function.prototype; 

//   get value(): any {
//     return this._value;
//   }

//   set value(v: any) {
//     if (v !== this._value) {
//       this._value = v;
//       this.onChange(v);
//     }
//   }

//   writeValue(value: any) {
//     this._value = value;
//   }

//   public registerOnChange(fn: (_: any) => {}): void {
//     this.onChange = fn;
//   }

//   public registerOnTouched(fn: () => {}): void {
//     this.onTouched = fn;
//   }

//   onBlur($event: Event) {
//     this.editing = false;
//     if ( this._value ==""){
//       this._value = "No value available";
//     }
//   }

//   beginEdit(value) {
//     this.preValue = value;
//     this.editing = true;
//   }
// }
