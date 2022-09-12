import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder

  ) { }

  loginForm = this.fb.group({
    username: ['',[Validators.required]],
    password: ['',[Validators.required]]
  });


  ngOnInit(): void {
  }

  onLogin(){
    console.log(this.loginForm.value);
  }
  isValidField(field: string):string{
   const validatedField = this.loginForm.get(field);
   return (!validatedField?.valid && validatedField?.touched) ? 'is-invalid' : validatedField?.touched ? 'is-valid' : '';
  }




 
  

}
