export interface Suggestion {
    // id: string;
    suggestion: string;
    dateSuggested: Date;
    tags: string[];
    company: string;
}

export interface SuggestionResponse {
    suggestions: Suggestion[];
    total: number;
    skip: number;
    limit: number;
}

export interface PopupEmail {
    body: string;
    isClient: boolean;
    dateTime: Date;
}
export interface SuggestionPopupData {
    emails: PopupEmail[];
}

export interface SuggestionsData{
    receiver: string;
    date: string;
    products: string[];
    suggestion: string;
}

export interface RecepientsResponse{
   recepients: string[];
}

export interface ProductsResponse{
    products: string[];
 }
   
