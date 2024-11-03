#include <bits/stdc++.h>
using namespace std;
float f(float x)
{
    
    return x*sin(x)+cos(x );
}
 
void secant(float x1, float x2, float E ,float maxitr)
{
    float n = 0, xm, x0, c;
    if (f(x1) * f(x2) < 0) {
        do {
            x0 = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));
 
            c = f(x1) * f(x0);
 
            x1 = x2;
            x2 = x0;
            cout<<"value of x at  "<<n<<"iteration is"<<x0<<endl;
            n++;
            if(maxitr<n){
                cout<<"insufficient iterations"<<endl;
                break;
            }
 
            if (c == 0)
                break;
            xm = (x1 * f(x2) - x2 * f(x1)) / (f(x2) - f(x1));
        } while (fabs(xm - x0) >= E); 
 
        cout << "Root of the given equation=" << x0 << endl;
        cout << "No. of iterations = " << n << endl;
    } else
        cout << "Can not find a root in the given interval";
}
 
int main()
{
    float x1,x2,E,maxitr;
    cout<<"enter the values of x1 ,x2 and allwoed error and maximum iteration"<<endl;
    cin>>x1>>x2>>E>>maxitr;
    secant(x1, x2, E,maxitr);
    return 0;
}
