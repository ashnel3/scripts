#Requires AutoHotkey v2.0

class Mash {
	__New() {
		This._Gui := Gui("-MinimizeBox", "Mash")
		This._Timer := ""
		This._TimerCallback := ObjBindMethod(This, "_Tick")

		; --- gui ---
		This._Hotkey := This._Gui.Add("Hotkey", "y5 x4 w148 h20")
		This._BtnStop := This._Gui.Add("Button", "+Disabled x154 y4 w40 h22", "Stop")
		This._BtnStart := This._Gui.Add("Button", "x196 y4 w40 h22", "Start")
		This._InputSpeed := This._Gui.Add("Edit", "x4 y28 w114 h22", "1000")
		This._InputDuration := This._Gui.Add("Edit", "x122 y28 w114 h22", "33")

		; --- events ---
		This._BtnStop.OnEvent("click", This._Stop.Bind(This))
		This._BtnStart.OnEvent("click", This._Start.Bind(This))
		This._Gui.OnEvent("Close", (*) => ExitApp(0))
	}

	__Delete() {
		This._Gui.Destroy()
	}

	_Tick() {
		key := This._Hotkey.Value or "Space"
		dur := Integer(This._InputDuration.Value)
		Send("{" key " Down}")
		Sleep(dur)
		Send("{" key " Up}")
	}

	_Start(*) {
		This._BtnStart.Enabled := false
		This._BtnStop.Enabled := true
		This._InputSpeed.Enabled := false
		This._InputDuration.Enabled := false
		This._Hotkey.Enabled := false
		; --- create timer ---
		This._Timer := SetTimer(This._TimerCallback, Integer(This._InputSpeed.Value))
	}

	_Stop(*) {
		This._BtnStart.Enabled := true
		This._BtnStop.Enabled := false
		This._InputSpeed.Enabled := true
		This._InputDuration.Enabled := true
		This._Hotkey.Enabled := true
		; --- remove timer ---
		This._Timer := SetTimer(This._TimerCallback, 0)
	}

	Error(msg) {
		MsgBox(msg, "Mash - Error!", "0x30")
	}

	Run() {
		This._Gui.Show("w240 h54")
	}
}

; --- Main ---
_Mash := Mash()
_Mash.Run()