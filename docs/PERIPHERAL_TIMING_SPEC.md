# Peripheral Bus Cycle Timing & Clock Divider Model

**Specification Version:** 1.0.0  
**Target Architecture:** Virtual Microcontroller Core (EmbeddedLab-OS)  
**Reference Clocks:** $16\,\text{MHz}$ (AVR ATmega328P) & $64\,\text{MHz}$ (STM32 Cortex-M0+)

---

## 1. SPI Clock Rate Generation

The virtual SPI peripheral generates the serial shift clock ($SCK$) by dividing the system oscillator frequency $f_{\text{osc}}$ according to register bits `SPR1`, `SPR0`, and `SPI2X`:

$$\text{SCK Frequency} = \frac{f_{\text{osc}}}{N}$$

| `SPI2X` | `SPR1` | `SPR0` | Divider Ratio ($N$) | Frequency at $16\,\text{MHz}$ | Transfer Time (8 bits) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 0 | 0 | 2 | $8.0\,\text{MHz}$ | $1.0\,\mu\text{s}$ |
| 0 | 0 | 0 | 4 | $4.0\,\text{MHz}$ | $2.0\,\mu\text{s}$ |
| 1 | 0 | 1 | 8 | $2.0\,\text{MHz}$ | $4.0\,\mu\text{s}$ |
| 0 | 0 | 1 | 16 | $1.0\,\text{MHz}$ | $8.0\,\mu\text{s}$ |
| 1 | 1 | 0 | 32 | $500\,\text{kHz}$ | $16.0\,\mu\text{s}$ |
| 0 | 1 | 0 | 64 | $250\,\text{kHz}$ | $32.0\,\mu\text{s}$ |
| 0 | 1 | 1 | 128 | $125\,\text{kHz}$ | $64.0\,\mu\text{s}$ |

In the JavaScript simulation loop, when an SPI byte transmission is initiated by writing to `SPDR`, the `SPIF` interrupt flag is asserted after precisely $\Delta t = \frac{8 \times N}{f_{\text{osc}}}$ simulated microseconds.

---

## 2. I2C / TWI Bit Rate Generator

For Two-Wire Interface (TWI/I2C) communication, the SCL clock frequency is derived from the Bit Rate Register (`TWBR`) and Prescaler bits (`TWPS1:0` in `TWSR`):

$$f_{\text{SCL}} = \frac{f_{\text{osc}}}{16 + 2 \cdot (\text{TWBR}) \cdot 4^{\text{TWPS}}}$$

- **Standard Mode ($100\,\text{kHz}$)** at $16\,\text{MHz}$:
  $$\text{TWBR} = 72, \quad \text{TWPS} = 0 \implies f_{\text{SCL}} = \frac{16\,000\,000}{16 + 2(72)(1)} = 100\,\text{kHz}$$
- **Fast Mode ($400\,\text{kHz}$)** at $16\,\text{MHz}$:
  $$\text{TWBR} = 12, \quad \text{TWPS} = 0 \implies f_{\text{SCL}} = \frac{16\,000\,000}{16 + 2(12)(1)} = 400\,\text{kHz}$$

---

## 3. UART Baud Rate Generator

The Universal Asynchronous Receiver Transmitter (UART) derives its baud rate generator divisor (`UBRR`) via:

$$\text{UBRR} = \left\lfloor \frac{f_{\text{osc}}}{16 \cdot \text{Baud}} \right\rfloor - 1$$

For double speed mode (`U2X = 1`):

$$\text{UBRR}_{\text{double}} = \left\lfloor \frac{f_{\text{osc}}}{8 \cdot \text{Baud}} \right\rfloor - 1$$

Percent error is calculated dynamically in the emulator:

$$\text{Error} (\%) = \left( \frac{\text{Actual Baud} - \text{Target Baud}}{\text{Target Baud}} \right) \times 100$$
