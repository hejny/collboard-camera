import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Promisable } from 'type-fest';
import { forTime } from 'waitasecond';

// TODO: !!! isEqual
export function observeByHeartbeat<T>(options: {
    getValue: () => T;
    waiter?: () => Promise<void>;
    isEqual?: (a: T, b: T) => Promisable<boolean>;
}): BehaviorSubject<T>;
export function observeByHeartbeat<T>(options: {
    getValue: () => Promise<T>;
    waiter?: () => Promise<void>;
    isEqual?: (a: T, b: T) => Promisable<boolean>;
}): Observable<T>;
export function observeByHeartbeat<T>(options: {
    getValue: () => Promisable<T>;
    waiter?: () => Promise<void>;
    isEqual?: (a: T, b: T) => Promisable<boolean>;
}): Observable<T> {
    const { getValue } = options;
    let { waiter, isEqual } = options;

    waiter = waiter || forTime.bind(null, 100);
    isEqual = isEqual || ((a: T, b: T) => a === b);

    const initialValue = getValue();
    let lastValue: T;

    let subject: Subject<T>;
    async function runHeartbeat() {
        while (true) {
            await waiter!();
            const newValue = await getValue();

            if (!isEqual!(lastValue, newValue)) {
                lastValue = newValue;
                subject.next(newValue);
            }
        }
    }

    if (initialValue instanceof Promise) {
        subject = new Subject<T>();
        initialValue.then((initialValueResolved) => {
            lastValue = initialValueResolved;
            subject.next(initialValueResolved);
            /* not await */ runHeartbeat();
        });
    } else {
        lastValue = initialValue as T;
        subject = new BehaviorSubject<T>(initialValue as T);
        /* not await */ runHeartbeat();
    }

    return subject;
}

/**
 * TODO: Move to main collboard
 * TODO: Observable fro mobx object
 */