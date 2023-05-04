
export async function fetchWithTimeout(url: string, options: any): Promise<Response> {
    if(options === undefined) options = {}

    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(url, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
  }