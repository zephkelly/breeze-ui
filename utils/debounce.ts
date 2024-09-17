export function debounce(func: any, timeout: any) {
    let timeoutId: any;
    return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

// export function debounceLeading(func: any, delay: any) {
//     let timeoutId: any;
//     return (...args: any) => {
//         if (!timeoutId) {
//             func(...args);
//         }

//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => timeoutId = null, delay);
//     };
// }

export function debounceLeading(func: (...args: any[]) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timeoutId === null) {
            func(...args);
        } else {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = null;
        }, delay);
    };
}

export function debounceLeadingExternal(func: (...args: any[]) => void) {
    let isReady = true;
    return {
        execute: (...args: any[]) => {
            if (isReady) {
                func(...args);
                isReady = false;
            }
        },
        reset: () => {
            isReady = true;
        }
    };
}