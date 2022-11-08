import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryI, ProductI } from './product';
import { ProductService } from './product.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormComponent } from './form/form.component';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy,AfterViewInit {

  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];
  private subscribe: Subscription = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private productSvc: ProductService,
    private matDialog: MatDialog
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Productos por página';
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(): void {
    this.productSvc.getAllProducts().subscribe((products: ProductI[]) => {
      this.dataSource = new MatTableDataSource<ProductI>(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onDelete(id: string): void {
    Swal.fire({
      title: 'Eliminar?',
      text: 'Eliminar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productSvc.delete(id).subscribe(res => {
          console.log(res);
          this.getProducts();
        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  onUpdateProduct(id:string,product: ProductI): void {
    this.productSvc.updateProduct(id,product).subscribe(res => {
      if (res) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Producto actualizado',
          showConfirmButton: false,
          timer: 1500
        });
      this.getProducts();
      }
    })
  }
  onEdit(id: string): void {
    this.productSvc.getById(id).subscribe((res:any) => {
      let categoriesId:CategoryI[] = res.categories.map((res:ProductI)=>res.id);
      console.log(categoriesId);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        name: res.name,
        price: res.price,
        categories: categoriesId,
      }
      const dialogRef = this.matDialog.open(FormComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((res:ProductI) => {
        if (res) {
          console.log(res);
          
          this.onUpdateProduct(id,res);
        }
      });
    })
  }
  onNewProduct(product: ProductI): void {
    this.subscribe?.add(
      this.productSvc.newProduct(product).subscribe(res => {
        if (res) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto creado',
            showConfirmButton: false,
            timer: 1500
          })
          this.getProducts();
        }
      })
    )

  }
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.matDialog.open(FormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.onNewProduct(res);
      }
    });
  }









}
