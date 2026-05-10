import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Use the credentials from your SecurityConfig.java
  const authData = localStorage.getItem('auth');
  if (authData) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authData}`)
    });
    return next(authReq);
  }

  return next(req);
};