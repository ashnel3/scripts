#Requires AutoHotkey v2.0
#SingleInstance Force

^!t:: {
	Run("wt new-tab")
}

;; === media hotkeys ===

^!Space:: {
	Send("{Media_Play_Pause}")
}
^!,:: {
	Send("{Media_Next}")
}
^!.:: {
	Send("{Media_Prev}")
}
^!WheelUp:: {
	Send("{Volume_Up}")
}
^!WheelDown:: {
	Send("{Volume_Down}")
}
