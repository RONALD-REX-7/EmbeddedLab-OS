# Microcontroller ADC Quantization & Voltage Conversion Model

**Specification Version:** 1.0.0  
**Target Platform:** Virtual Microcontroller ADC Emulation Engine (EmbeddedLab-OS)  
**Resolution:** 10-bit Successive Approximation Register (SAR)

---

## 1. 10-Bit ADC Voltage Quantization Formulation

An analog voltage $V_{\text{IN}}$ sampled by an ideal 10-bit SAR ADC referenced to $V_{\text{REF}}$ produces an unsigned 10-bit integer digital code $D \in [0, 1023]$:

$$D = \left\lfloor \frac{V_{\text{IN}} \cdot 1024}{V_{\text{REF}}} \right\rfloor$$

$$\text{Quantized Voltage } V_q = D \cdot \frac{V_{\text{REF}}}{1024}$$

### Quantization Error Boundaries:
$$\text{LSB} = \frac{V_{\text{REF}}}{1024} = \frac{5.000\,\text{V}}{1024} \approx 4.8828\,\text{mV} \quad (\text{at } V_{\text{REF}} = 5.0\,\text{V})$$

$$\text{Quantization Error } e_q = V_{\text{IN}} - V_q, \quad 0 \le e_q < 1\,\text{LSB}$$

---

## 2. Voltage Reference Selection & Channel Multiplexing

The virtual ADC status and control register `ADMUX` selects reference voltage sources:
- `REFS[1:0] = 00`: External `AREF` pin reference.
- `REFS[1:0] = 01`: Default $V_{CC}$ with external capacitor on `AREF`.
- `REFS[1:0] = 11`: Internal $1.1\,\text{V}$ bandgap voltage reference.

