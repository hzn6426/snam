import { useState, useRef } from 'react';
import { useRefFn, useSubscription } from 'observable-hooks';
import { Subject } from 'rxjs';

export const useObservableAutoCallback = (init, selector) => {
  var [data, setData] = useState();

  var events$Ref = useRefFn(() => new Subject());
  var outputs$Ref = useRefFn(() => init(events$Ref.current));
  var callbackRef = useRef(function () {
    console.log(init);
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    events$Ref.current.next(selector ? selector(args) : args[0]);
    outputs$Ref.current.subscribe({
      next: (d) => setData(d),
    });
  });
  return [callbackRef.current, data];
};
