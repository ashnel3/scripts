#Requires AutoHotkey v2.0

class MashKeyGui extends Gui {
  _Timer := ""
  _TimerCallback := ObjBindMethod(this, "_Tick")
  Running := false

  __New() {
		super.__New("-MinimizeBox", "MashKey", this)

		; --- gui ---
		this._Hotkey := this.AddHotkey("y5 x4 w148 h20")
		this._BtnStop := this.AddButton("+Disabled x154 y4 w40 h22", "Stop")
		this._BtnStart := this.AddButton("x196 y4 w40 h22", "Start")
		this._InputSpeed := this.AddEdit("x4 y28 w114 h22", "1000")
		this._InputDuration := this.AddEdit("x122 y28 w114 h22", "33")

		; --- events ---
		this._BtnStop.OnEvent("click", (*) => this.Stop())
		this._BtnStart.OnEvent("click", (*) => this.Start())
		this.OnEvent("Close", (*) => ExitApp(0))
	}

	_Tick() {
		key := this._Hotkey.Value or "Space"
		dur := Integer(this._InputDuration.Value)
		Send("{" key " Down}")
		Sleep(dur)
		Send("{" key " Up}")
	}

	Start() {
		this.Running := true
    	; disable components
		this._BtnStart.Enabled := false
		this._BtnStop.Enabled := true
		this._InputSpeed.Enabled := false
		this._InputDuration.Enabled := false
		this._Hotkey.Enabled := false
		; create timer
		this._Timer := SetTimer(this._TimerCallback, Integer(this._InputSpeed.Value))
	}

	Stop() {
    	this.Running := false
    	; reenable components
		this._BtnStart.Enabled := true
		this._BtnStop.Enabled := false
		this._InputSpeed.Enabled := true
		this._InputDuration.Enabled := true
		this._Hotkey.Enabled := true
		; remove timer
		this._Timer := SetTimer(this._TimerCallback, 0)
	}

	Error(msg) {
		MsgBox(msg, "KeyMash - Error!", "0x30")
	}
}

; Main

Mash := MashKeyGui()
Mash.Show("w240 h54")

f5:: {
  if (not Mash.Running) {
    Mash.Start()
  }
}

f6:: {
  if (Mash.Running) {
    Mash.Stop()
  }
}

f8:: {
  ExitApp(0)
}
