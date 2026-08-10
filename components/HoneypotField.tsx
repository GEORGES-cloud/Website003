'use client';
import { forwardRef } from 'react';

/* Campo trampa anti-bots: invisible para personas y lectores de pantalla;
   los bots que rellenan todos los campos lo delatan. /api/contact descarta
   en silencio cualquier envío que llegue con este campo relleno. */
const HoneypotField = forwardRef<HTMLInputElement>(function HoneypotField(_, ref) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Company
        <input ref={ref} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
});

export default HoneypotField;
