(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
//        @desc which album is playing, for use in next and previous buttons
//        @type {Object}
        var currentAlbum = Fixtures.getAlbum();
        
//        @desc Buzz object audio file
//        @type {Object}
        var currentBuzzObject = null;
        
//        @function setSong
//        @desc Stops currently playing song and loads new audio file as currentBuzzObject
//        @param {Object} song
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong();
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                    if (currentBuzzObject.isEnded()) {
                        SongPlayer.next();
                    }
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
//        @function playSong
//        @desc plays song and sets song.playing to true so album.html changes play/pause icon
//        @param {Object} song
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }
        
//        @function pauseSong
//        @desc pauses song and sets song.playing to false so album.html changes play/pause icon
//        @param {Object} song
        var pauseSong = function(song) {
            currentBuzzObject.pause();
            song.playing = false;
        }
        
        var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }
        
//        @function getSongIndex
//        @desc gets the song index so we can then manipulate it for next and previous buttons
//        @param {Object} song
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
//        @desc current song object set to null when page loads
//        @desc publicly defined so it's viewable by both album and playerBar templates
//        @type {Object}
        SongPlayer.currentSong = null;
//        @desc Current playback time in seconds of currently playing song
//        @type {Number}
        SongPlayer.currentTime = null;
//        @desc current song volume from 0 to 100
//        @type {Number}
        SongPlayer.volume = 75;
        
//        @function SongPlayer.play(song)
//        @desc plays a song from the beginning if the song has not already started and continues playing the song from where it left off if not
//        @params {Object} song
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
//        @function SongPlayer.pause(song)
//        @desc pauses a song at its current time point
//        @params {Object} song
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            pauseSong(song);
        };
        
//        @function SongPlayer.previous
//        @desc skips backward to previous song, stops playing music if song #1
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
//        @function SongPlayer.next
//        @desc skips forward to next song, stops playing music if last song
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > Object.keys(currentAlbum).length) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        }
        
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            };
        };
        
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        }
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();