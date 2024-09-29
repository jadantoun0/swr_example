export interface RequestInfo<T = any> {
    queryParams?: Record<string, string>,
    body?: T,
    pathVariable?: string,
}
