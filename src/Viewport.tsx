import React, { ReactElement } from 'react';
import './Viewport.css';

import { useViewport } from './util/hooks';

function Viewport(): ReactElement {
  const { canvasRef } = useViewport(
    gl => {
      gl.clearColor(0, 0, 0, 1);
    },
    gl => {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  );
  return <canvas ref={canvasRef} className="Viewport" />;
}

export default Viewport;
