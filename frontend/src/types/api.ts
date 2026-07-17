export interface ConvertRequest {
    url: string;
    format: 'md' | 'json' | 'txt';
}

export interface ConvertResponse {
    data: string;
    title?: string;
    author?: string;
    date?: string;
    source_url?: string;
    error?: string;
}
