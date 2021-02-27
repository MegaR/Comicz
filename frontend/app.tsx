import React from 'react';
import { Classes, FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

export default function App() {
    console.log('test');
    return <div className={Classes.DARK}>Hello, world50asdasdasd!</div>;
}
