// environment.ts
export const environment = {
  production: false,
  cognito: {
    userPoolId: 'eu-north-1_th2y0foMR',
    clientId: '3c6fees1n6vsphb647kt4hli1p',
    region: 'eu-north-1'
  },
  // callAnalyzerAPI: "http://ec2-52-66-17-237.ap-south-1.compute.amazonaws.com:8000",
  callAnalyzerAPI: "http://127.0.0.1:8000"
};
