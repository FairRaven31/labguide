export const pedagogyData = {
  "multimeter": {
    beginner: `
# Introduction to the Digital Multimeter (DMM)

## 👁️ What is it?
The **Digital Multimeter** is the most essential tool in any electronics lab. Think of it as a doctor's stethoscope, but for circuits. It allows you to quickly "listen" to what is happening inside a wire. 

It measures three fundamental things:
*   **Voltage (V):** Like measuring water pressure in a pipe.
*   **Current (A):** Like measuring how fast the water is flowing.
*   **Resistance (Ω):** Like measuring how narrow the pipe is.

## 🎛️ Basic Operation
1.  **Select the Mode:** Turn the dial (or press the button) to select what you want to measure (V, A, or Ω).
2.  **Plug in the Probes:** 
    *   The **Black** probe always goes into the **COM** (Common/Ground) port.
    *   The **Red** probe goes into the port labeled with what you want to measure (V/Ω for voltage/resistance, A/mA for current).
3.  **Take the Measurement:** Touch the metal tips of the probes to the metal parts of your circuit.

> [!WARNING] Safety First
> When measuring current (A), the DMM becomes part of the circuit. If you measure a power supply directly in Current mode, you will create a short circuit and blow the DMM's internal fuse!
    `,
    intermediate: `
# Advanced DMM Measurements

## ⚡ Reading the Display
Modern DMMs, like the **7352A**, are "autoranging." This means you don't have to guess whether your voltage is 5V or 50V before measuring—the device figures it out. However, you must pay attention to the prefix on the screen:
*   **mV:** Millivolts (1/1000th of a Volt). Very small signals!
*   **mA:** Milliamps. Standard for small electronics.

## 🔍 Continuity Testing
One of the most useful features of a DMM is the **Continuity Beeper** (often marked with a sound wave icon). 
*   **What it does:** It checks if two points are electrically connected. 
*   **How to use it:** Touch the two probes together. You should hear a loud *BEEP*. Now, touch two ends of a wire. If it beeps, the wire is good. If it's silent, the wire is broken internally.

## 📏 Diode Testing
Diodes are like one-way valves for electricity. The DMM has a special Diode mode to test them. It pushes a small voltage through the diode and measures the "forward voltage drop" (usually around 0.6V for standard silicon diodes). If it reads 'OL' (Open Loop) in both directions, the diode is dead.
    `,
    advanced: `
# Precision Analytics & R&S 7352A Specs

## 🎯 Accuracy and Resolution
When doing high-level engineering, "5 Volts" is never just 5 Volts. It might be 5.012V. 
The **7352A** is a 5½-digit multimeter. This means it can display numbers up to 199,999. This extreme resolution is critical when analyzing highly sensitive analog sensors or calibrating other equipment.

## 🔌 4-Wire Resistance Measurement (Kelvin Sensing)
When measuring very small resistors (e.g., 0.1 Ω), the resistance of your own test probes can ruin the measurement!
*   **The Solution:** 4-Wire measurement.
*   **How it works:** It uses two wires to supply a known current, and a separate pair of wires to measure the voltage drop directly at the component, completely eliminating probe resistance from the math.

## 📊 Dual Display & Logging
The 7352A features a dual display, meaning you can measure AC voltage and frequency *at the same time*. It also supports USB logging, allowing you to track how a battery's voltage drops over 24 hours directly to your computer.

---
### 📚 Further Reading & Resources
*   [The Art of Electronics (Horowitz & Hill) - Chapter 1: Foundations](https://artofelectronics.net/)
*   [Rohde & Schwarz DMM Fundamentals Guide](https://www.rohde-schwarz.com/)
*   **Textbook Recommendation:** *Practical Electronics for Inventors* (Section on Metrology)
    `
  },
  "power-supply": {
    beginner: `
# Introduction to the Power Supply

## 👁️ What is it?
A **DC Power Supply** is the beating heart of your lab. It provides the electrical energy (the "food") that makes your circuits wake up and do things. Think of it as a highly adjustable, infinitely replaceable battery.

Instead of hunting for a 9V battery or two AA batteries, you simply type "9V" or "3V" into the Power Supply, and it delivers exactly that.

## 🎛️ Basic Operation
1.  **Set the Voltage (V):** This is the "pressure" you want to apply to the circuit. (e.g., 5.00V for standard Arduino circuits).
2.  **Set the Current Limit (A):** This is the **most important safety feature**. It tells the power supply: *"Never let the circuit pull more than this much current."* If your circuit has a short, the power supply stops it from catching fire!
3.  **Turn on the Output:** The power supply won't actually send electricity to the cables until you explicitly press the glowing "Output On" button.

> [!TIP] The Golden Rule of Power Supplies
> ALWAYS set your Current Limit (usually around 0.1A to 0.5A for small electronics) BEFORE you turn the Output On.
    `,
    intermediate: `
# Intermediate Power Supply Operations

## ⚡ Constant Voltage (CV) vs Constant Current (CC)
A power supply is always in one of two modes, usually indicated by a green or red light on the screen:

*   **CV (Constant Voltage):** The normal mode. The supply outputs exactly the voltage you asked for, and the circuit draws whatever current it needs (as long as it's below your limit).
*   **CC (Constant Current):** If your circuit tries to draw *more* current than your limit, the supply switches to CC mode. It will aggressively drop the voltage to ensure the current never exceeds your limit. 

## 🔄 Series vs Parallel Operations
Most lab supplies (like the **NGE100**) have multiple channels (outputs).
*   **Need more Voltage?** Connect two channels in **Series** (positive of Ch1 to negative of Ch2). Two 30V channels become a massive 60V supply!
*   **Need more Current?** Connect two channels in **Parallel** (positive to positive, negative to negative). Two 3A channels become a 6A supply!
    `,
    advanced: `
# Advanced Power Analytics & NGE100 Specs

## 📈 Programmable Sequencing
In advanced testing, you don't just want to turn a circuit on; you want to see how it handles a brownout (a sudden drop in voltage). 
The **NGE100** allows for programmable sequences. You can program it to output 5V for 10 seconds, drop to 3.3V for 2 seconds, and then spike to 6V, allowing you to stress-test your microcontrollers automatically.

## 🛡️ Over-Voltage Protection (OVP) and Over-Current Protection (OCP)
While the CC limit gently lowers voltage, OCP and OVP are hard-kill switches. 
If you set the OVP to 5.5V and the supply detects a spike hitting 5.5V, it will instantly physically disconnect the output via an internal relay, saving your extremely expensive prototype boards from destruction.

## 🔌 Galvanic Isolation
All channels on the NGE100 are galvanically isolated. This means there is no internal connection between Channel 1 and Channel 2, nor are they tied to Earth Ground. They behave exactly like completely separate batteries, allowing you to stack them or create negative voltage rails (like -12V, 0V, +12V) for operational amplifiers without creating ground loops.

---
### 📚 Further Reading & Resources
*   [Understanding Linear vs Switch-Mode Power Supplies](https://www.electronicdesign.com/)
*   [Rohde & Schwarz NGE100 Data Sheet](https://www.rohde-schwarz.com/)
    `
  },
  "function-generator": {
    beginner: `
# Introduction to the Function Generator

## 👁️ What is it?
A **Function Generator** creates electrical waves. Imagine tossing a pebble into a pond to create ripples; this device creates those ripples in wires. 

Instead of flat, boring DC power (like a battery), it generates AC (Alternating Current) signals that constantly change over time.

## 🌊 The Three Big Waves
It can create almost any shape, but the three fundamentals are:
1.  **Sine Wave:** Smooth and rolling. Looks like ocean waves. Used for testing audio equipment and radios.
2.  **Square Wave:** Instantly snaps on and off. Used to simulate digital computer clocks (0s and 1s).
3.  **Triangle/Ramp Wave:** Slowly ramps up, then snaps down. Used for scanning and sweeping.

## 🎛️ Setup & Usage
You only need to tell it three things:
*   **Shape:** (Sine, Square, etc.)
*   **Amplitude:** How "tall" the wave is (e.g., 5 Volts Peak-to-Peak).
*   **Frequency:** How fast the wave repeats every second, measured in Hertz (Hz). 1 kHz means 1,000 waves per second!
    `,
    intermediate: `
# Signal Modulation & Manipulation

## 🎚️ DC Offset
A pure AC wave oscillates perfectly around 0 Volts (e.g., going from +2V to -2V). 
However, many digital circuits can't handle negative voltages! A **DC Offset** shifts the entire wave up or down. By applying a +2V DC offset to that same wave, it will now bounce between 0V and +4V, making it perfectly safe for an Arduino to read.

## 📡 Modulation (AM/FM)
You don't just have to output a boring, steady wave. The Function Generator can modulate (change) the wave on the fly.
*   **Amplitude Modulation (AM):** The "tallness" of the wave goes up and down over time. (This is exactly how AM radio stations transmit voices over radio waves!)
*   **Frequency Modulation (FM):** The "speed" of the wave compresses and stretches over time.

## 🔀 Duty Cycle
When outputting a Square wave, the "Duty Cycle" determines how much time the wave spends "High" vs "Low". A 50% duty cycle is a perfect square. A 10% duty cycle means it briefly flashes high, then stays low for a long time. This is used in PWM (Pulse Width Modulation) to dim LEDs or control motor speeds!
    `,
    advanced: `
# Arbitrary Waveforms & HMF2550 Specs

## 🎨 Arbitrary Waveform Generation (AWG)
The **HMF2550** is not just a standard function generator; it is an *Arbitrary* Function Generator. 
This means you aren't limited to Sine or Square waves. You can draw literally any shape on your computer—a simulated heartbeat EKG, a recorded car engine knock, or a glitchy digital packet—load it via USB, and the HMF2550 will perfectly recreate that electrical signal in the real world.

## ⚡ Output Impedance (50 Ω vs High-Z)
One of the most common mistakes engineers make is ignoring output impedance.
The HMF2550 expects to be plugged into a 50 Ω load. If you tell it to output 5V, but you plug it into an Oscilloscope (which has a very high impedance of 1 MΩ), the wave will suddenly look like it's 10V tall!
*   **The Fix:** Always ensure your Generator's load setting (50 Ω or High-Z) matches what you are actually plugging it into.

## ⏱️ Jitter and Rise Time
When outputting 25 MHz square waves for digital logic testing, the "sharpness" of the corners matters. The HMF2550 boasts incredibly fast rise times (under 8ns), ensuring that your digital clocks are crisp and your logic gates trigger exactly when expected without jitter.

---
### 📚 Further Reading & Resources
*   [Impedance Matching and Signal Integrity Analysis](https://www.allaboutcircuits.com/)
*   [Rohde & Schwarz HMF2550 User Manual](https://www.rohde-schwarz.com/)
    `
  },
  "oscilloscope": {
    beginner: `
# Introduction to the Oscilloscope

## 👁️ What is it?
The **Oscilloscope** (or "Scope") is the ultimate set of eyes for an engineer. While a Multimeter only gives you a single number (like "5V"), an Oscilloscope draws a picture of exactly what the electricity is doing over time. 

It is basically an incredibly fast graphing calculator. 
*   **The Y-Axis (Vertical):** Shows the Voltage.
*   **The X-Axis (Horizontal):** Shows Time.

## 🎛️ Basic Operation
1.  **Connect the Probe:** Clip the ground wire to your circuit's ground, and touch the sharp tip to the signal you want to see.
2.  **Adjust the Time (Horizontal):** Turn the Horizontal knob to zoom in or out of time. (e.g., seeing 1 second of data vs 1 millisecond).
3.  **Adjust the Voltage (Vertical):** Turn the Vertical knob to make the wave look taller or shorter on the screen so it fits perfectly.

> [!TIP] The "Cheat Code"
> If you are completely lost and the screen is a mess of squiggly lines, press the glowing **"AUTOSET"** button. The Oscilloscope will analyze the signal and automatically zoom to the perfect scale!
    `,
    intermediate: `
# Mastering Triggers & Probing

## 🎯 The Trigger System
Without a trigger, a fast-moving wave looks like a blurry, unreadable mess scrolling across the screen. 
**The Trigger tells the scope exactly when to take a picture.**
*   **Edge Trigger:** You tell the scope: *"Wait until the voltage crosses 2.0V going UP, and then freeze the picture!"* 
This ensures that every time the wave repeats, the scope draws it in the exact same spot on the screen, making a 1 million Hz wave look completely perfectly still.

## 🔍 Probe Attenuation (10X)
Look closely at your oscilloscope probe; there is usually a small switch labeled "1X / 10X". 
*   **Always use 10X.** 
*   In 10X mode, the probe has a 9-megaohm resistor inside it. It reduces the signal to 1/10th of its size before sending it to the scope. The scope knows this, and multiplies it back by 10 on the screen. This drastically reduces the "capacitive loading" on your circuit, preventing the probe itself from altering the delicate signal you are trying to measure!

## 📏 Cursors & Automated Measurements
Instead of counting the little grid squares to figure out how tall a wave is, use the **Measurements** menu. The scope can automatically calculate the Vpp (Peak-to-Peak Voltage), Frequency, Rise Time, and Duty Cycle instantly.
    `,
    advanced: `
# Advanced Digital Analytics & RTB2000 Specs

## 🧠 10-Bit ADC Resolution
Most standard oscilloscopes use 8-bit Analog-to-Digital Converters (ADCs), giving them 256 vertical steps. 
The **R&S RTB24** features a massive **10-bit ADC**. This provides 1024 vertical steps—four times more resolution than standard scopes. This allows you to zoom in and see tiny millivolt ripples riding on top of large 10V signals, which would be entirely invisible on older scopes.

## 📡 FFT (Fast Fourier Transform)
Usually, a scope shows you the "Time Domain" (Voltage vs. Time). 
By pressing the **FFT** button, the RTB2000 uses heavy mathematics to convert the signal into the "Frequency Domain" (Power vs. Frequency). If you have a noisy signal, the FFT will instantly show you exactly what frequencies are causing the noise (e.g., a massive spike at 60Hz means wall-power interference!).

## 🚌 Serial Protocol Decoding
When looking at digital data lines (like I2C, SPI, or UART between two microchips), seeing a bunch of square waves is useless. The RTB2000 has hardware protocol decoders. It translates those high-speed square waves into actual readable English text and Hexadecimal values directly on the screen, completely automating the debugging of digital microcontrollers!

---
### 📚 Further Reading & Resources
*   [The XYZs of Oscilloscopes (Tektronix Primer)](https://www.tek.com/)
*   [Rohde & Schwarz RTB2000 Specifications & 10-bit Tech Notes](https://www.rohde-schwarz.com/)
    `
  },
  "spectrum-analyzer": {
    beginner: `
# Introduction to the Spectrum Analyzer

## 👁️ What is it?
If an Oscilloscope shows you *when* things happen, a **Spectrum Analyzer** shows you *what* is happening. 

Imagine listening to a symphony orchestra. An oscilloscope shows you the total volume of the room. A Spectrum Analyzer acts like a magical equalizer—it shows you exactly how loud the violins are, how loud the cellos are, and how loud the drums are, all separated out.

*   **The Y-Axis (Vertical):** Shows Power (Loudness), usually measured in dBm.
*   **The X-Axis (Horizontal):** Shows Frequency (Pitch), from low frequencies on the left to high frequencies (GHz) on the right.

## 🎛️ Basic Operation
1.  **Center Frequency:** Tell the analyzer what frequency you want to look at. (e.g., If you are testing a Wi-Fi router, set it to 2.4 GHz).
2.  **Span:** How wide of a "window" you want to look through. A 100 MHz span means you are looking 50 MHz to the left and 50 MHz to the right of your center frequency.
3.  **Reference Level:** Adjust the top of the screen to fit your strongest signal.
    `,
    intermediate: `
# Navigating the RF World

## 📉 Understanding dBm (Decibel-milliwatts)
In the RF (Radio Frequency) world, signals can range from thousands of watts down to a billionth of a watt. 
Because of this massive range, we use a logarithmic scale called **dBm**.
*   **0 dBm** = 1 milliwatt.
*   **-30 dBm** = 1 microwatt.
*   **-100 dBm** = A signal so incredibly weak, it's like hearing a whisper from a mile away (but your cell phone can still detect it!).

## 🔍 Resolution Bandwidth (RBW)
The RBW is the most critical setting on a Spectrum Analyzer. It determines how "sharp" the analyzer's glasses are.
*   **Wide RBW (e.g., 1 MHz):** The analyzer sweeps across the screen very fast, but the lines look fat and blurry. You might miss two signals that are very close together.
*   **Narrow RBW (e.g., 1 kHz):** The analyzer draws incredibly sharp, distinct lines, allowing you to see tiny signals hidden right next to big ones. *However*, the analyzer takes much, much longer to draw the screen.

## 🕵️ Peak Search & Markers
Never guess the frequency by looking at the grid. Press the **"Marker to Peak"** button. The analyzer will automatically find the tallest spike on the screen and give you the exact frequency down to the Hertz, and the exact power down to the decimal.
    `,
    advanced: `
# Advanced RF Analysis & FPC1500 Specs

## 🚀 The 3-in-1 Instrument
The **R&S FPC1500** is a revolutionary piece of lab gear. It is not just a Spectrum Analyzer. Because it features an internal Tracking Generator and an independent signal source, it actually operates as three distinct instruments:
1.  **Spectrum Analyzer:** For looking at signals in the air.
2.  **Vector Network Analyzer (VNA):** For measuring how antennas reflect power (S11 measurements).
3.  **Signal Generator:** For broadcasting test signals up to 3 GHz.

## 📡 EMI Troubleshooting (Electromagnetic Interference)
When designing consumer electronics, they must pass strict FCC regulations ensuring they don't leak radio noise. 
Using the FPC1500 paired with a Near-Field Probe (a tiny antenna that looks like a magnifying glass), you can physically scan over a circuit board. The screen will instantly spike when you hover over the exact microchip that is illegally radiating RF noise!

## 📉 DANL (Displayed Average Noise Level)
Every instrument has internal electronic noise. You cannot measure a signal that is weaker than the instrument's own noise floor. The FPC1500 has a remarkably low DANL of <-165 dBm (with the preamplifier enabled). This means it is sensitive enough to pick up stray cellular signals bouncing off the moon!

---
### 📚 Further Reading & Resources
*   [Microwave Engineering (David M. Pozar)](https://www.wiley.com/)
*   [Rohde & Schwarz FPC1500 Application Notes on EMI Debugging](https://www.rohde-schwarz.com/)
    `
  },
  "network-analyzer": {
    beginner: `
# Introduction to the Vector Network Analyzer (VNA)

## 👁️ What is it?
The **VNA** is the most complex instrument in the lab, used exclusively for high-frequency Radio and Microwave engineering. 

If a Spectrum Analyzer is like a microphone that simply *listens* to signals in the air, a VNA is like a sonar system. It actively *shoots* a signal into a cable or antenna, and then precisely measures how much of that signal bounces back, and how much makes it through.

## 📡 Why do we need it?
Imagine shining a flashlight at a window. 
*   Most of the light goes *through* the window. 
*   Some of the light *reflects* back into your eyes. 
At high frequencies (like 5G cell phones and Wi-Fi), electrical signals act exactly like light. If you build a bad antenna, the power doesn't leave the phone; it reflects backward and burns out the transmitter chip! The VNA prevents this.
    `,
    intermediate: `
# S-Parameters: The Language of RF

## 📊 Understanding S11 & S21
VNAs speak a language called "Scattering Parameters" or **S-Parameters**.
If you have a device with 2 ports (like a filter), you hook it up to Port 1 and Port 2 of the VNA.

*   **S11 (Return Loss / Reflection):** The VNA shoots power out of Port 1, and measures how much bounces *back* into Port 1. You want this number to be very low (e.g., -20 dB). If it's high (0 dB), it means all your power is bouncing off a wall!
*   **S21 (Insertion Loss / Transmission):** The VNA shoots power out of Port 1, and measures how much successfully makes it all the way *through* to Port 2. You want this number to be near 0 dB (which means 100% of the signal survived).

## 🎯 The Importance of Calibration
A VNA is useless without calibration. The cables you use to connect the VNA to your antenna actually alter the signal! 
Before any test, you must perform an "OSL Calibration" (Open, Short, Load). You screw three highly precise, incredibly expensive metal caps onto the end of your cables. The VNA measures them, learns exactly how much the cable is messing up the signal, and mathematically subtracts the cable from all future measurements!
    `,
    advanced: `
# Smith Charts & ZNLE6 Specs

## 🕸️ The Smith Chart
When viewing S11 reflection data, advanced engineers don't just look at a standard line graph; they look at a **Smith Chart**.
It looks like a complex web of circles. It doesn't just tell you *that* your antenna is reflecting power; it tells you *why*.
*   If the dot is in the top half of the circle, your antenna is too **Inductive** (acting like a coil).
*   If the dot is in the bottom half, your antenna is too **Capacitive** (acting like a battery). 
Engineers use the Smith Chart to instantly calculate exactly what capacitor to solder onto the board to perfectly "tune" the antenna!

## 🚀 R&S ZNLE6 Performance
The **ZNLE6** is a powerhouse bidirectional VNA capable of sweeping from 1 MHz all the way to a staggering 6 GHz (covering everything from AM radio to 5.8GHz Wi-Fi and sub-6 5G bands). 
It features incredibly fast sweep times, meaning you can literally watch the Smith Chart update in real-time as you physically wave your hand near an antenna, witnessing how human tissue affects the electromagnetic field.

## ⏱️ Time Domain Reflectometry (TDR)
Normally, a VNA looks at frequencies. But using advanced math (Inverse Fourier Transform), the ZNLE6 can simulate looking at time! 
If you have a 100-foot underground coaxial cable that got chewed by a rat, the VNA can shoot a pulse down it, measure the reflection time, and tell you exactly: *"The cable is broken exactly 42.6 feet away from the connector."*

---
### 📚 Further Reading & Resources
*   [RF Circuit Design (Chris Bowick) - Mandatory reading for RF Engineers](https://www.elsevier.com/)
*   [Rohde & Schwarz ZNLE6 Vector Network Analyzer Primer](https://www.rohde-schwarz.com/)
    `
  }
};
