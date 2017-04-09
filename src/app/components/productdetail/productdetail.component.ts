import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product;

  quantity = 1;

  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router,
    private _auth: AuthService
  ) { }


  changeQty(num) {
    this.quantity += num;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }


  subtotal() {
    return this.quantity * this.product.price
  }


  onBack() {
    this._router.navigate(['/']);
  }



  ngOnInit() {
    //用URL上id取得product data
    const url = 'http://localhost:3000/api/product';
    const id = this._route.snapshot.params['id'];
    this._http.get(`${url}/${id}`)
      .map(res => res.json().product)
      .subscribe(product => {
        this.product = product;
      });
  }

}
