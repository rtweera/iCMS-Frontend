export const URLS = {
    // baseUrl: 'http://localhost:8000/email',
    // baseUrlv2: 'http://localhost:8000/email/v2',
    // baseUrl: 'http://44.234.117.141:8080/email',
    // baseUrlv2: 'http://44.234.117.141:8080/email/v2',
    baseUrl: 'http://ec2-13-201-92-74.ap-south-1.compute.amazonaws.com/email/',
    baseUrlv2: 'http://ec2-13-201-92-74.ap-south-1.compute.amazonaws.com/email/v2',
}

export const SETTINGS = {
    defaultLimit: 10,
    defaultSkip: 0,
    timeoutDuration: 60000,  // Timeout duration in milliseconds
}

export const ERRORS = {
    timeoutError: 'Request timed out. Please try again later.',
    unknownFetchError: 'Unknown error has occured while fetching data. Please try again later.',
}

export const INTERVALS = {
    pollingInterval: 240000 // 120,000 milliseconds
}