package com.dutaduta.sketchme.videoconference.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Constant{
	FILESERVER_DIRECTORY("./fileserver/"),
	PICTURE_DIRECTORY("./fileserver/picture"),
	TIMELAPSE_DIRECTORY("./fileserver/timelapse"),
	BACKGROUND_IMAGE_DIRECTORY("./fileserver/backgroundimage"),
	BGM_DIRECTORY("./fileserver/bgm"),
	ARTIST_PROFILE_DIRECTORY("./fileserver/artist/profile"),
	USER_PROFILE_DIRECTORY("./fileserver/user/profile");
	private final String value;
}
